import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth';
import { Config } from 'sst/node/config';
import { UserField } from '../database/constants';
import { usersService } from '../services/users.service';

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      email?: string;
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

        const existingUser = await usersService.findByEmail(email);
        if (!existingUser) {
          await usersService.create({
            data: {
              [UserField.Email]: email,
              [UserField.FirstName]: given_name,
              [UserField.LastName]: family_name,
              [UserField.GoogleId]: sub,
              [UserField.GooglePictureUrl]: picture,
            },
          });
        }

        // TODO: Check roles and permissions

        return Session.cookie({
          redirect: Config.CMS_URL,
          type: 'user',
          properties: {
            email,
          },
        });
      },
    }),
  },
});
