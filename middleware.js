// middleware.js
export function middleware(req) {
  // 何も行わず、そのままリクエストを通す（または404を返す）
  return;
}

export const config = {
  // matcher を空にして、全リクエストでミドルウェアを実行しないようにする
  matcher: [],
};
