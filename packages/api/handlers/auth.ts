import { StatusCodes } from 'http-status-codes';
import { ApiHandler } from 'sst/node/api';
import { AuthHandler, GoogleAdapter, Session, useSession } from 'sst/node/auth';
import { Config } from 'sst/node/config';
import { UserSessionField } from '../constants';
import { UserField } from '../database/constants';
import { usersService } from '../services/users.service';

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      [UserSessionField.UserId]: string;
    };
  }
}

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: Config.GOOGLE_CLIENT_ID,
      onSuccess: async tokenset => {
        const { email, given_name, family_name, sub, picture } = tokenset.claims();
        if (!email) {
          throw new Error('User has no email');
        }

        let userId;
        const existingUser = await usersService.findByEmail(email);
        if (!existingUser) {
          const createdUser = await usersService.create({
            data: {
              [UserField.Email]: email,
              [UserField.FirstName]: given_name,
              [UserField.LastName]: family_name,
              [UserField.GoogleId]: sub,
              [UserField.GooglePictureUrl]: picture,
            },
          });

          userId = createdUser[UserField.Id];
        } else {
          userId = existingUser[UserField.Id];
        }

        // TODO: Assign default role

        return Session.cookie({
          redirect: Config.CMS_URL,
          type: 'user',
          properties: { [UserSessionField.UserId]: userId },
        });
      },
    }),
  },
});

export const logout = ApiHandler(async () => {
  let session;
  try {
    session = useSession();
  } catch (error) {
    console.error(error);
  }

  if (!session || session.type !== 'user' || !(UserSessionField.UserId in session.properties)) {
    return { statusCode: StatusCodes.UNAUTHORIZED };
  }

  return {
    statusCode: StatusCodes.OK,
    headers: {
      /* Expire the auth token cookie */
      'Set-Cookie':
        'auth-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=None;Secure;HttpOnly',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});
