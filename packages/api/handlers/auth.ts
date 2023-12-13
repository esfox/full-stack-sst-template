import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth';
import { Config } from 'sst/node/config';
import { UserField } from '../database/constants';
import { usersService } from '../services/users.service';
import { UserSessionField } from '../constants';

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

        // TODO: Check roles and permissions

        return Session.cookie({
          redirect: Config.CMS_URL,
          type: 'user',
          properties: { [UserSessionField.UserId]: userId },
        });
      },
    }),
  },
});
