# Grand Theft Auto VI — Landing Page (fan-made)

Landing page conceitual de GTA VI em **React + TypeScript**, com **GSAP (ScrollTrigger)**, **Framer Motion** e **Lenis**,
inspirada em [rockstargames.com/VI](https://www.rockstargames.com/VI). Não é afiliada à Rockstar Games.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Seções e animações

| Seção | Técnica |
| --- | --- |
| **Loading** | "VI" de palmeiras enchendo com o degradê de pôr do sol. Enquanto pré-carrega a capa, avalia o aparelho (núcleos, memória, GPU, rede, movimento reduzido e um teste de FPS) e escolhe um modo: **completo**, **equilibrado** (metade dos frames, sem desfoque de fundo) ou **leve** (1/3 dos frames em resolução menor, imagens no lugar dos vídeos, sem scroll suave). Dá para forçar com `?perf=low|medium|high` ou pelo menu (Movimento → Desempenho). |
| **Menu** | Layout do menu oficial: painel esquerdo com o "VI" de palmeiras (troca por uma prévia ao passar o mouse nos subitens) e a barra de lançamento; painel direito com R★, itens com submenus, idioma e opção "Movimento" (reduz animações/scroll suave). |
| **Hero** | Capa oficial em camadas (10 painéis PNG). No scroll os painéis voam a partir do logo; o "VI" vira uma máscara CSS que mostra Vice City e a câmera atravessa a letra "I"; então uma **sequência de 99 frames** do Trailer 1 (voo até a praia) é tocada em `<canvas>` com a sinopse. |
| **Trailers** | Um Olhar Estendido, Trailer 2 e Trailer 1 — modal Framer Motion com YouTube (o Olhar Estendido tem restrição de idade, então abre um painel com links para YouTube/Netflix) e link para o MP4 4K oficial. Fundo com loop do Trailer 1. |
| **Jason & Lucia** | Nome gigante deslizando, imagem principal abrindo como janela (clip-path), galeria em parallax e clipes oficiais. |
| **Só em Leonida** | **Vídeo controlado pelo scroll** (voo ao pôr do sol do Trailer 2, codificado com keyframe a cada 4 frames e carregado como blob para seek instantâneo). |
| **Elenco** | Scroll horizontal fixado; fundo ilustrado e recorte do personagem com velocidades diferentes. |
| **Locais / Edições** | Acordeão com layout animado; cards Padrão (US$ 79,99) e Ultimate (US$ 99,99) com tilt 3D, seletor PS5/Xbox e links das lojas; carrossel arrastável da Ultimate. |
| **Bônus / Coleção** | Colagem com parallax do Vintage Vice City Pack; itens da Vice City Collection flutuando com parallax do mouse. |
| **Final** | Revelação do logo (120 frames do Trailer 1) no scroll + contagem regressiva para 19/11/2026. |

## Assets

Os arquivos em `public/` são gerados por scripts (precisam de internet; usam `ffmpeg-static`):

```bash
npm run assets:fetch   # baixa ~280 imagens/vídeos do site oficial para assets-src/ (ignorado no git)
npm run assets:images  # converte para WebP otimizado em public/img (mapa em scripts/asset-map.mjs)
npm run assets:media   # extrai trechos dos trailers oficiais (rockstargames.com/VI/downloads) via HTTP range
npm run assets:light   # variantes leves: frames de 900/720px e quadros estáticos dos vídeos
```

Também vêm do site oficial: as fontes em `public/fonts` (GTA Art Deco Condensed Heavy e Helvetica Now, usadas no menu e na barra do hero), o "VI" com palmeiras do menu (`public/img/brand/vi-palms.svg`, componente LogoGlow), o R★ e os logos PS5/Xbox/VI (`src/components/BrandIcons.tsx`).

`scripts/extract-media.mjs` define os cortes (início/duração) de cada sequência de frames e vídeo.

Todo o conteúdo de Grand Theft Auto VI (artes, trailers, marcas) pertence à Rockstar Games / Take-Two Interactive.
