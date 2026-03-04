export const AUTH_DISABLED =
  process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

export const DEMO_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "demo@proposalforge.com",
};

export const DEMO_PROFILE = {
  id: DEMO_USER.id,
  full_name: "Demo User",
  email: DEMO_USER.email,
  role: "admin",
  organization_id: "00000000-0000-0000-0000-000000000001",
  organizations: { name: "Demo Hotel Group", slug: "demo" },
};
