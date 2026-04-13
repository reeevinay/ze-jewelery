-- ============================================================
-- Aurelius Jewelry — PostgreSQL Database Schema (Neon)
-- Run this once to initialise your database
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── customers ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  phone       TEXT,
  address     JSONB,           -- { line1, line2, city, state, pincode, country }
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_name  ON customers(name);

-- ─── products ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  description       TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price             INTEGER NOT NULL CHECK (price > 0),   -- paise (₹ × 100)
  compare_price     INTEGER,                              -- MRP in paise
  category          TEXT NOT NULL CHECK (
                      category IN ('rings','necklaces','earrings','bracelets',
                                   'bangles','pendants','sets')
                    ),
  subcategory       TEXT,
  material          TEXT NOT NULL,
  weight            TEXT,
  dimensions        TEXT,
  stock_qty         INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  images            JSONB NOT NULL DEFAULT '[]',          -- array of Cloudinary public IDs
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  meta_title        TEXT,
  meta_description  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_search   ON products USING gin(to_tsvector('english', name || ' ' || description));

-- ─── orders ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT NOT NULL UNIQUE,
  customer_id      UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  subtotal         INTEGER NOT NULL,         -- paise
  discount         INTEGER NOT NULL DEFAULT 0,
  shipping_fee     INTEGER NOT NULL DEFAULT 0,
  total            INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (
                     status IN ('pending','payment_pending','payment_failed',
                                'confirmed','processing','shipped',
                                'delivered','cancelled','refunded')
                   ),
  payment_id       TEXT,                    -- Razorpay payment / order ID
  payment_method   TEXT,
  payment_status   TEXT NOT NULL DEFAULT 'pending' CHECK (
                     payment_status IN ('pending','paid','failed','refunded')
                   ),
  shipping_address JSONB NOT NULL,
  tracking_id      TEXT,
  tracking_url     TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer    ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created     ON orders(created_at DESC);

-- ─── order_items ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,              -- snapshot at time of purchase
  product_image TEXT NOT NULL DEFAULT '',
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price         INTEGER NOT NULL,           -- unit price in paise
  total         INTEGER NOT NULL,           -- quantity × price in paise
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ─── auto-update updated_at trigger ─────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_customers_updated ON customers;
CREATE TRIGGER trg_customers_updated
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated ON products;
CREATE TRIGGER trg_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated ON orders;
CREATE TRIGGER trg_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Sample seed data ────────────────────────────────────────
-- Insert 2 sample products for testing (optional)

INSERT INTO products (name, slug, description, short_description, price, compare_price, category, material, stock_qty, images, featured, is_active)
VALUES
  (
    'Eternal Solitaire Ring',
    'eternal-solitaire-ring',
    'A timeless solitaire ring crafted in 18K yellow gold with a brilliant-cut VS1 clarity diamond. The cathedral setting elevates the stone for maximum brilliance, while the comfort-fit band ensures all-day wearability. Each ring comes hallmarked and certified.',
    'Classic 18K gold solitaire ring with a brilliant-cut diamond.',
    450000,  -- ₹4,500
    550000,  -- ₹5,500
    'rings',
    '18K Yellow Gold, Diamond (0.25 ct)',
    15,
    '["aurelius/products/ring-1", "aurelius/products/ring-1-alt"]',
    TRUE,
    TRUE
  ),
  (
    'Golden Cascade Necklace',
    'golden-cascade-necklace',
    'An elegant layered necklace in 22K gold featuring a cascade of hand-hammered discs. The 45cm chain sits perfectly at the collarbone. Hallmark certified with a lobster-claw clasp for secure wear.',
    'Layered 22K gold necklace with hand-hammered disc pendants.',
    380000,  -- ₹3,800
    NULL,
    'necklaces',
    '22K Yellow Gold',
    8,
    '["aurelius/products/necklace-1"]',
    TRUE,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;
