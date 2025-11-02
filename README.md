# Calculadora de Artilharia (sistema de cálculo — branch `sm5`)

> Aplicação para cálculo balístico/elementos de tiro para artilharia leve — conjunto de utilitários para predição de elevação e deriva a partir de coordenada inicial, tabelas de tiro e parâmetros do obus 105mm.

**Repositório:** https://github.com/devautomafeb/sm-artilharia/tree/sm4

---

## 📌 Visão geral

Este projeto fornece uma interface e bibliotecas para:
- Calcular **elevação** e **deriva** necessários para tiro de artilharia leve (ex.: obus 105mm).
- Trabalhar com coordenadas iniciais (UTM / WGS84) e transformar entre sistemas.
- Aplicar **tabelas de tiro** (curvas balísticas, ajustes por vento, temperatura, pressão, altitude).
- Simular saídas e gerar ajustes para o apontador/condutor de tiro.

O código é escrito majoritariamente em **TypeScript** e usa **Vite + React** no front-end (estrutura já presente no branch `sm4`).

---

## ⚙️ Funcionalidades (prováveis / implementadas)

> Ajuste conforme o que já existe no `src/` — abaixo são exemplos úteis para documentar.

- Conversão UTM ↔ WGS84.
- Cálculo de distância (Haversine), rumo inicial e diferença de altitude.
- Conversão de ângulos para mils (6000 / 6400 conforme configuração).
- Predição de elevação e deriva usando tabelas de tiro (entrada: distância, munição, carga, condições atmosféricas).
- UI para inserir coordenadas, parâmetros meteorológicos e selecionar munição/tabela.
- Exportar resultados (CSV / JSON) para posteamento no sistema de tiro.

---

## 🧩 Pré-requisitos

- Node.js >= 18 (recomendado)
- npm ou yarn
- Git

---

## 🔧 Instalação (desenvolvimento)

```bash
# clonar branch sm4
git clone --branch sm4 https://github.com/devautomafeb/sm-artilharia.git
cd sm-artilharia

# instalar dependências
npm install
# ou
# yarn
