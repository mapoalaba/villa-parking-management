# 베이스 이미지 설정 (최신 Node.js 버전 사용)
FROM node:22

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 앱의 의존성 설치
COPY package*.json ./
RUN npm install

# SSL 인증서 파일 복사
COPY certs/ ./certs

# 앱 소스 복사
COPY . .

# 앱 포트 노출
EXPOSE 3001

# 앱 시작 명령어
CMD ["node", "server.js"]