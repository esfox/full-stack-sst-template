---
to: packages/api/handlers/<%= h.inflection.dasherize(tableName) %>.ts
unless_exists: true
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const camelizedName = h.inflection.camelize(tableName, true) %><% _%>
<% const singularPascalizedName = h.inflection.transform(tableName, [ 'camelize', 'singularize' ]) %><% _%>
<% const timestampColumns = [ 'created_at', 'updated_at', 'deleted_at' ] %><% _%>
<%_
  function getZodFunction(column) {
    const type = column.type;
    let zodFunction = 'string().trim()';
    if (type.includes('number')) {
      zodFunction = 'number()';
    } else if (type.includes('boolean')) {
      zodFunction = 'boolean()';
    } else if (type.includes('Date')) {
      zodFunction = 'date()';
    }

    if (type.includes('null') || column.isNullable || column.hasDefaultValue) {
      zodFunction += '.optional()'
    }

    return zodFunction;
  }
_%>

import { z } from 'zod';
import { <%= singularPascalizedName %>Field } from '../database/constants';
import { <%= camelizedName %>Service } from '../services/<%= dasherizedName %>.service';
import {
  createArchiveHandler,
  createDestroyHandler,
  createGetHandler,
  createListHandler,
  createPatchHandler,
  createPostHandler,
} from './common';

export const list = createListHandler(<%= camelizedName %>Service);
export const get = createGetHandler(<%= camelizedName %>Service);
export const post = createPostHandler(
  <%= camelizedName %>Service,
  z.object({
    <%_ for (const column of columns) { _%>
      <%_ if (!column.hasDefaultValue && column.name !== primaryKey && !timestampColumns.some(tc => column.name.includes(tc))) { _%>
        [<%= singularPascalizedName %>Field.<%= h.inflection.camelize(column.name) %>]: z.<%= getZodFunction(column) %>,
      <%_ } _%>
    <%_ } _%>
  })
);
export const patch = createPatchHandler(
  <%= camelizedName %>Service,
  z.object({
    <%_ for (const column of columns) { _%>
      <%_ if (!column.hasDefaultValue && column.name !== primaryKey && !timestampColumns.some(tc => column.name.includes(tc))) { _%>
        [<%= singularPascalizedName %>Field.<%= h.inflection.camelize(column.name) %>]: z.<%= getZodFunction(column) %>,
      <%_ } _%>
    <%_ } _%>
  })
);
export const destroy = createDestroyHandler(<%= camelizedName %>Service);
export const archive = createArchiveHandler(<%= camelizedName %>Service);

