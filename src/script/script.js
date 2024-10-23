let indexTeam = 0;
const pilotsPage = 2;

async function getPilotPoints() {
    try {
        const response = await fetch('https://ergast.com/api/f1/current/driverStandings.json');
        const data = await response.json();
        const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        // Agrupa pilotos por equipe
        const teams = {};
        for (const driver of drivers) {
            const teamName = driver.Constructors[0].name;
            if (!teams[teamName]) {
                teams[teamName] = [];
            }
            teams[teamName].push(driver);
        }

        // Transforma o objeto em um vetor de equipes
        const teamArray = Object.values(teams);

        // Atualiza os cards com os pilotos
        if (indexTeam < teamArray.length) {
            const currentTeam = teamArray[indexTeam];

            for (let i = 0; i < pilotsPage; i++) {
                if (i < currentTeam.length) {
                    const pilot = currentTeam[i];
                    document.getElementById(`name-${i + 1}`).textContent = `${pilot.Driver.givenName} ${pilot.Driver.familyName}`;
                    document.getElementById(`points-${i + 1}`).textContent = pilot.points;
                    document.getElementById(`position-${i + 1}`).textContent = pilot.position;
                    document.getElementById(`nationality-${i + 1}`).textContent = pilot.Driver.nationality;
                    document.getElementById(`image-${i + 1}`).src = `./src/image/${pilot.Driver.familyName.toLowerCase()}.png`; // caminho para a imagem do piloto
                }
            }

            // Atualiza o nome da equipe
            document.getElementById("team-name").textContent = currentTeam[0].Constructors[0].name;

        }
    } catch (error) {
        console.error("Erro ao buscar os dados da API:", error);
    }
}

function nextPilots() {
    indexTeam++;
    if (indexTeam >= totalTeams) { // totalTeams deve ser definido após o carregamento
        indexTeam = 0; // Volta para o primeiro time
    }
    getPilotPoints();
}

function previousPilots() {
    indexTeam--;
    if (indexTeam < 0) {
        indexTeam = totalTeams - 1;
    }
    getPilotPoints();
}

async function initialize() {
    const response = await fetch('https://ergast.com/api/f1/current/driverStandings.json');
    const data = await response.json();
    const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    // Agrupa pilotos por equipe
    const teams = {};
    for (const driver of drivers) {
        const teamName = driver.Constructors[0].name;
        if (!teams[teamName]) {
            teams[teamName] = [];
        }
        teams[teamName].push(driver);
    }

    // Transforma o objeto em um vetor de equipes
    const teamArray = Object.values(teams);
    totalTeams = teamArray.length; // Define o número total de equipes
    getPilotPoints();
}

initialize();
