import { DataTable } from "./data-table.js";
import { useUsers, type User } from "./use-users.js";
import { useAuth } from "./auth-context.js";

export function UserListFeature() {
  const auth = useAuth();
  const state = useUsers();

  switch (state.status) {
    case "loading":
      return <p>در حال بارگذاری…</p>;
    case "error":
      switch (state.error.kind) {
        case "network":
          return <p role="alert">اتصال برقرار نشد</p>;
        case "http":
          return <p role="alert">خطای سرور ({state.error.status})</p>;
        case "contract":
          return <p role="alert">پاسخ سرور نامعتبر بود</p>;
      }
      break;
    case "success":
      return (
        <DataTable
          rows={state.users}
          columns={[
            { header: "نام", cell: "name" },
            {
              header: "ایمیل",
              cell: (u: User) => <a href={`mailto:${u.email}`}>{u.email}</a>,
            },
          ]}
          onRowClick={auth.role === "admin" ? u => console.log(u.id) : undefined}
        />
      );
  }
}
