let dados = [];
let graficoLinha, graficoBarra, graficoMensal;


fetch("GLB.Ts+dSST.csv")
  .then((res) => {
    if (!res.ok) throw new Error("Erro ao carregar CSV");
    return res.text();
  })
  
  .then((csv) => {
    const linhas = csv.split("\n").slice(1);

    dados = linhas
      .map((linha) => {
        const col = linha.split(",");

        if (col.length < 13) return null;

        return {
          ano: parseInt(col[0]),
          meses: col
            .slice(1, 13)
            .map((v) => parseFloat(v.replace(/[^0-9.-]/g, "")) || 0),
        };
      })
      .filter(Boolean);

    criarGraficos(2019);
  })
  .catch((err) => console.error("ERRO:", err));

function criarGraficos(anoLimite) {
  const filtrados = dados.filter((d) => d.ano <= anoLimite);

  const anos = filtrados.map((d) => d.ano);

  const mediaAnual = filtrados.map((d) => {
    const soma = d.meses.reduce((a, b) => a + b, 0);
    return soma / 12;
  });

  if (graficoLinha) graficoLinha.destroy();
  if (graficoBarra) graficoBarra.destroy();
  if (graficoMensal) graficoMensal.destroy();

  graficoLinha = new Chart(document.getElementById("GraficoLinha"), {
    type: "line",
    data: {
      labels: anos,
      datasets: [
        {
          label: "Média Anual",
          data: mediaAnual,
        },
      ],
    },
  });

  graficoBarra = new Chart(document.getElementById("GraficoBarra"), {
    type: "bar",
    data: {
      labels: anos.slice(-20),
      datasets: [
        {
          label: "Últimos 20 anos",
          data: mediaAnual.slice(-20),
        },
      ],
    },
  });

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const mediaMensal = Array(12).fill(0);

  filtrados.forEach((d) => {
    d.meses.forEach((v, i) => {
      mediaMensal[i] += v;
    });
  });

  for (let i = 0; i < 12; i++) {
    mediaMensal[i] /= filtrados.length || 1;
  }

  graficoMensal = new Chart(document.getElementById("GraficosMensal"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        {
          label: "Média Mensal",
          data: mediaMensal,
        },
      ],
    },
  });
}

document.getElementById("rangeAno").addEventListener("input", (e) => {
  const ano = e.target.value;
  document.getElementById("anoSelecionado").innerText = ano;
  criarGraficos(parseInt(ano));
});


