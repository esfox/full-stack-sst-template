---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.dasherize(tableName) %>-table-row/<%= h.inflection.dasherize(tableName) %>-table-row.component.html
---
<% const camelizedSingularName = h.inflection.singularize(h.inflection.camelize(tableName, true)) %><% _%>
<% const getFieldNameByIndex = (index) => h.inflection.camelize(columns[index].name, true) %><% _%>
<ng-template #content>
  <tr class="border-b-0" [class]="{ 'bg-[var(--base-150)]': altBg }">
    <% if (columns[1]) { %><% _%>
      <td>
        <div class="flex items-center gap-3">
          <div class="font-bold">{{ <%= camelizedSingularName %>.<%= getFieldNameByIndex(1) %> }}</div>
        </div>
      </td>
    <% } %>
    <% if (columns[2]) { %><% _%>
      <td>{{ <%= camelizedSingularName %>.<%= getFieldNameByIndex(2) %> ?? '-' }}</td>
    <% } %>
    <% if (columns[3]) { %><% _%>
      <td>{{ <%= camelizedSingularName %>.<%= getFieldNameByIndex(3) %> ?? '-'  }}</td>
    <% } %>
    <% if (columns[4]) { %><% _%>
      <td>{{ <%= camelizedSingularName %>.<%= getFieldNameByIndex(4) %> ?? '-'  }}</td>
    <% } %>
    <td>
      <app-dropdown-menu
        class="dropdown-end"
        toggle-class="m-1 btn btn-sm btn-ghost"
        [items]="actionMenu"
      >
        <i class="fa fa-ellipsis-vertical"></i>
      </app-dropdown-menu>
    </td>
  </tr>
  @if (isShowingExpandRow) {
    <tr [class]="{ 'bg-[var(--base-150)]': altBg }">
      <td class="align-top p-0" colspan="5">
        <div class="relative">
          <button
            class="btn btn-ghost btn-circle btn-sm absolute top-2 right-2"
            role="button"
            (click)="toggleExpand()"
          >
            <i class="fa-solid fa-xmark fa-lg"></i>
          </button>
          <table>
            <tbody>
              <tr class="border-0">
                <td><%= h.inflection.titleize(primaryKey) %></td>
                <td>
                  <code>{{ <%= camelizedSingularName %>.<%= h.inflection.camelize(primaryKey, true) %> }}</code>
                </td>
              </tr>
              <% const createdAtColumn = columns.find(column => column.name === 'created_at') %><% _%>
              <% if (createdAtColumn) { %><% _%>
                <tr class="border-0">
                  <td>Created at</td>
                  @if (<%= camelizedSingularName %>.createdAt) {
                    <td>{{ <%= camelizedSingularName %>.createdAt | date }}</td>
                  } @else {
                    <td>-</td>
                  }
                </tr>
              <% } %>
              <% const updatedAtColumn = columns.find(column => column.name === 'updated_at') %><% _%>
              <% if (updatedAtColumn) { %><% _%>
                <tr class="border-0">
                  <td>Last updated at</td>
                  @if (<%= camelizedSingularName %>.updatedAt) {
                    <td>{{ <%= camelizedSingularName %>.updatedAt | date }}</td>
                  } @else {
                    <td>-</td>
                  }
                </tr>
              <% } %>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  }
</ng-template>
