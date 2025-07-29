export default function Head() {
  return (
    <>
      {/* ✅ Preload محسّن للصورة الأولى في الكاروسيل */}
      <link
        rel="preload"
        as="image"
        href="https://i.postimg.cc/WpDTYW7x/2147923447-2-2-1.webp"
        type="image/webp"
        fetchpriority="high"
      />

      {/* إعدادات أساسية للصفحة */}
      <title>توظيفك - فرصتك المهنية تبدأ من هنا</title>
      <meta name="description" content="اكتشف فرص عمل، أنشئ إعلانات، وابدأ رحلتك المهنية بسهولة مع توظيفك." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
