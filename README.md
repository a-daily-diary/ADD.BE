## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 로컬 개발 및 배포(Docker Compose)

> ⚠️ **아래 매뉴얼을 따라하기 전에, 반드시 Docker가 설치되어 있어야 합니다.**
>
> - 각 운영체제(Windows, macOS, Linux)에 맞는 [Docker Desktop](https://www.docker.com/products/docker-desktop/)을 설치하세요.
> - 설치 방법은 [공식 매뉴얼](https://docs.docker.com/get-docker/)을 참고하세요.

### 1. 환경 변수 설정

1. `.env.example` 파일을 참고하여 `.env` 파일을 프로젝트 루트에 복사/생성합니다.
2. 각 항목을 실제 환경에 맞게 수정합니다.

```bash
cp .env.example .env
```

- 주요 환경변수 예시:
  - `DB_HOST`: DB 컨테이너 서비스명 (docker-compose.yml의 postgres 서비스명과 일치)
  - `DB_PORT`: 5432 (컨테이너 내부 포트)
  - `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: Postgres 접속 정보

### 2. Docker 이미지 빌드 및 컨테이너 실행

#### 컨테이너 실행 (백그라운드)

- 가장 기본적인 실행 방법:

```bash
docker-compose up -d
```

- 위 명령어로 컨테이너가 백그라운드에서 실행됩니다.
- 서버는 기본적으로 `localhost:5000`에서 접근 가능합니다.
- 이미 5000 포트를 사용 중이면, docker-compose.yml에서 콜론 앞 포트 번호를 변경하세요.

#### 코드 수정 시

- 코드가 변경된 경우에는 이미지를 새로 빌드해야 변경사항이 반영됩니다.
- 아래와 같이 `--build` 옵션을 추가해 실행하세요:

```bash
docker-compose up -d --build
```

- 기존 컨테이너가 실행 중이라면, `docker-compose down`으로 중지 후 다시 실행해도 됩니다.

### 3. DB 데이터 유지

- 컨테이너 종료 시에도 DB 데이터를 유지하고 싶다면, docker-compose.yml의 `volumes` 주석을 해제하세요.
  ```yaml
  # volumes:
  #   - ./db-data:/var/lib/postgresql/data
  ```

### 4. 포트 및 서비스명 주의사항

- `add-be` 컨테이너는 5000번 포트(혹은 변경한 포트)로 외부에 노출됩니다.
- `postgres` 컨테이너는 15432(호스트):5432(컨테이너)로 매핑되어 있습니다.
- 컨테이너 내부에서 DB에 접근할 때는 항상 `DB_HOST=postgres`와 `DB_PORT=5432`로 설정해야 합니다.

### 5. 기타

- 컨테이너 로그 확인: `docker-compose logs -f`
- 컨테이너 중지: `docker-compose down`
- 컨테이너 강제 재시작: `docker-compose restart`
