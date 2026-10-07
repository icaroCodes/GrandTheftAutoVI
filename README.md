# Grand Theft Auto VI (landing conceitual)

Landing page de GTA VI feita com React, TypeScript, GSAP (ScrollTrigger), Framer Motion e Lenis, inspirada em
[rockstargames.com/VI](https://www.rockstargames.com/VI). Projeto de estudo e portfólio, sem ligação com a
Rockstar Games.

<img src="./public/img/brand/hero.png" alt="Grand Theft Auto VI">

```bash
npm install
npm run dev          # desenvolvimento
npm run build        # build de produção em dist/
npm run test:e2e     # testes de fumaça (Playwright, desktop e mobile)
```

## Como foi feito

- **Capa em camadas.** Os painéis da capa oficial se separam a partir do logo, o "VI" vira máscara e a câmera
  entra nele até a sequência de frames do Trailer 1, tudo preso ao scroll.
- **Vídeo controlado pelo scroll** na seção de Leonida, com keyframe a cada 4 frames para o seek não travar.
- **Três níveis de desempenho.** A página decide na hora pelo hardware e pela rede; o teste de FPS roda depois da
  entrada e vale a partir da próxima visita. `?perf=low`, `medium` ou `high` na URL força um nível.
- **Carregamento sob demanda.** Vídeos, sequências de frames e seções abaixo da capa só carregam quando
  precisam. A capa tem versões menores para notebook e celular.

Lighthouse no build de produção: desktop 96, mobile ~62 (a animação de entrada pesa na simulação de 4G),
acessibilidade, boas práticas e SEO 100.

## Assets

`npm run assets` baixa as artes e os trailers do site oficial e gera WebP, frames e clipes com ffmpeg. Os tempos
de cada trecho estão em `scripts/extract-media.mjs`.

As tags Open Graph usam a URL de produção que a Vercel informa no build. Em outra hospedagem, copie `.env.example` para `.env` e preencha `SITE_URL`.

## Licença

O código está sob [MIT](./LICENSE). Imagens, vídeos e logos em `public/` pertencem à Rockstar Games e à
Take-Two e não fazem parte da licença. Se você é detentor de algum desses direitos e quer a remoção, abra uma
issue.
