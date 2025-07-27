import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 환경변수는 기본적으로 서버사이드에서만 사용 가능
  // 클라이언트에서 필요한 경우만 NEXT_PUBLIC_ 접두사 사용
};

export default nextConfig;
