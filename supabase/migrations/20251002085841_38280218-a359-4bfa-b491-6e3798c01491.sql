-- Enable realtime for cart_items table
ALTER TABLE cart_items REPLICA IDENTITY FULL;

-- Add cart_items table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;