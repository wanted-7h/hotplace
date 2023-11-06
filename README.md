# :fire: Hotplace

<figure>
  <a href="https://chat.openai.com/share/b2f86fe8-e656-44ab-b2d9-6b529517e4dd">
    <img
      title="OpenAI DALL-E 3에 의해 생성된 AI 이미지"
      alt="Discord Restaurant Recommendation API header image"
      src="https://github-production-user-asset-6210df.s3.amazonaws.com/54838975/280215640-db6be176-1c8b-4525-bfef-eab1a8263517.png" />
  </a>
</figure>

<p align="center" width="100%">
  <img alt="Typescript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/node.js-v20.9.0-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="Sequelize" src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white"/>
  <img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
</p>

[원티드 프리온보딩 백엔드 인턴십 7차](https://www.wanted.co.kr/events/pre_ob_be_7) H팀의 2주차 맛집 추천 웹 서비스 API입니다.

## 구현 기능

TBD

## 실행 방법

```sh
git clone https://github.com/wanted-7h/hotplace
cd hotplace
npm install
npm run dev
```

### api_key

- [경기데이터드림](https://data.gg.go.kr/portal/mainPage.do) 접속 후 회원가입을 진행
- 마이페이지에서 인증키 발급을 통해 apikey을 얻을 수 있습니다.

## 테스트 방법

[노드 내장 테스트 러너](https://nodejs.org/docs/latest-v20.x/api/test.html)를 사용합니다.

```sh
npm run test
```

## 기술 스택

[팀원분들과 논의한 결과](https://github.com/orgs/wanted-7h/discussions/19#discussioncomment-7434283), 팀원분들이 사용 경험이 있어 익숙하고, 사용량이 많아 자료 검색이 용이한 기술 스택 위주로 선정하였습니다.

- 자바스크립트 런타임: [Node.js v20.9.0 LTS](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V20.md#20.9.0)
- 타입스크립트 실행 환경: [Ts-Node](https://typestrong.org/ts-node/)
- DB: [MySql](https://www.mysql.com)
- ORM: [Sequelize](https://sequelize.org/docs/v6/getting-started/)
- 라우팅: [express](https://expressjs.com/)
- 입출력 파싱 검증: [Zod](https://https://zod.dev/)
- 컨트롤러 입출력 검증 및 OpenAPI 문서 생성: [Ts-Rest](https://ts-rest.com)

## 라이선스

[AGPL-3.0-only](./LICENSE)
