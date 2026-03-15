-- ============================================================
-- SEED DATA: Grand Traverse Home Co. — First Tenant
-- ============================================================
-- Run after initial migration to provision the first tenant.
-- This creates the tenant, theme, domain, services, and AI config.

-- 1. Create the tenant
INSERT INTO tenants (id, name, slug, status, plan, settings)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Grand Traverse Home Co.',
  'grandtraverse',
  'active',
  'professional',
  jsonb_build_object(
    'business_type', 'general_contractor',
    'license_number', 'MI-GC-2024-5678',
    'service_area', 'Traverse City, MI and surrounding areas',
    'founded_year', 2009,
    'phone', '(231) 555-0142',
    'email', 'info@grandtraversehomeco.com',
    'address', '123 Front Street, Traverse City, MI 49684',
    'website', 'https://grandtraversehomeco.com'
  )
) ON CONFLICT (slug) DO NOTHING;

-- 2. Create tenant theme/branding
INSERT INTO tenant_themes (tenant_id, primary_color, secondary_color, accent_color, heading_font, body_font, logo_url, favicon_url, custom_css)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '#1B3A2D',                          -- Forest green primary
  '#2E75B6',                          -- Blue secondary
  '#D4A84B',                          -- Gold accent
  'Playfair Display',                 -- Serif heading font
  'Inter',                            -- Clean body font
  '/logos/tenants/grandtraverse-logo.png',
  '/logos/tenants/grandtraverse-favicon.png',
  ''
) ON CONFLICT (tenant_id) DO NOTHING;

-- 3. Register custom domain
INSERT INTO tenant_domains (tenant_id, domain, is_primary, verified)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'grandtraversehomeco.com', true, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'grandtraverse.contractorsos.com', false, true)
ON CONFLICT (domain) DO NOTHING;

-- 4. Service catalog
INSERT INTO service_catalog (tenant_id, name, slug, description, category, base_price_min, base_price_max, unit, is_active, sort_order)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kitchen Remodeling', 'kitchen-remodeling', 'Complete kitchen renovations from layout redesign to final trim. Cabinets, countertops, appliances, flooring, and lighting.', 'remodeling', 25000, 85000, 'project', true, 1),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bathroom Remodeling', 'bathroom-remodeling', 'Full bathroom renovations including tile, fixtures, vanities, showers, and tubs. ADA-compliant options available.', 'remodeling', 12000, 45000, 'project', true, 2),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Custom Home Building', 'custom-home-building', 'Ground-up custom home construction. From foundation to finish, we build your dream home.', 'new_construction', 200000, 800000, 'project', true, 3),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'General Contracting', 'general-contracting', 'Full-service general contracting for residential and light commercial projects. Project management, subcontractor coordination, and quality assurance.', 'general', 5000, 500000, 'project', true, 4),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deck & Outdoor Living', 'deck-outdoor-living', 'Composite and wood decks, patios, pergolas, outdoor kitchens, and fire pits.', 'outdoor', 8000, 60000, 'project', true, 5),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Basement Finishing', 'basement-finishing', 'Transform your basement into livable space. Framing, insulation, electrical, plumbing, and finishing.', 'remodeling', 20000, 70000, 'project', true, 6)
ON CONFLICT DO NOTHING;

-- 5. AI module routing (use defaults — claude-sonnet-4-6 for all modules)
INSERT INTO ai_module_routing (tenant_id, module, model_key, routing_strategy, is_active)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'scope_generator', 'claude-sonnet-4-6', 'fixed', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'estimate_builder', 'claude-sonnet-4-6', 'fixed', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'contract_drafter', 'claude-sonnet-4-6', 'fixed', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'email_writer', 'claude-sonnet-4-6', 'fixed', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'chat', 'claude-sonnet-4-6', 'fixed', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'lead_scorer', 'claude-sonnet-4-6', 'fixed', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'proposal_writer', 'claude-sonnet-4-6', 'fixed', true)
ON CONFLICT DO NOTHING;

-- 6. Tenant sequences
INSERT INTO tenant_sequences (tenant_id, sequence_type, prefix, current_value)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'invoice', 'GTHC-INV-', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'estimate', 'GTHC-EST-', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'proposal', 'GTHC-PRO-', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'contract', 'GTHC-CON-', 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'project', 'GTHC-PRJ-', 0)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Grand Traverse Home Co. is now provisioned and ready.
-- Next steps:
--   1. Create admin user account via Supabase Auth
--   2. Connect Stripe Connect account
--   3. Upload logo files to Supabase Storage
--   4. Configure DNS for grandtraversehomeco.com
-- ============================================================
