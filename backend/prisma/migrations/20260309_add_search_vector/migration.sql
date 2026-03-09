-- 添加 searchVector 列
ALTER TABLE "posts" ADD COLUMN "search_vector" tsvector;

-- 创建更新 searchVector 的函数
CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" :=
    setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.content, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.summary, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS post_search_vector_update ON "posts";
CREATE TRIGGER post_search_vector_update
  BEFORE INSERT OR UPDATE ON "posts"
  FOR EACH ROW
  EXECUTE FUNCTION update_post_search_vector();

-- 更新现有数据
UPDATE "posts" SET "search_vector" =
  setweight(to_tsvector('simple', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('simple', COALESCE(content, '')), 'B') ||
  setweight(to_tsvector('simple', COALESCE(summary, '')), 'C');

-- 创建 GIN 索引
CREATE INDEX IF NOT EXISTS "posts_search_vector_idx" ON "posts" USING GIN ("search_vector");