# sisref-v2-dashboard
----------------------------
## Para rodar via Docker:
```bash
docker compose eup
```

----------------------------
## Para rodar localmente no Windows:

Instalar o runtime do bun (Windows):

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```


Instalar as dependências:

```bash
bun install
```

Executar:

```bash
cd sisref-v2-dashboard-client
bun install
bun dev
```

Para acessar o cliente web:
[http://localhost:3000](http://localhost:3000)

Este projeto foi criado usando `bun init` na versão 1.1.2 do bun. [Bun](https://bun.sh) é um runtime JavaScript rápido e completo.
