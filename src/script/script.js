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
                    document.getElementById(`team-${i + 1}`).textContent = pilot.Constructors[0].name;
                    document.getElementById(`position-${i + 1}`).textContent = pilot.position;
                    document.getElementById(`image-${i + 1}`).src = `./src/image/${pilot.Driver.familyName.toLowerCase()}.png`; // caminho para a imagem do piloto
                }
            }
        } else {
            indexTeam = 0;
            getPilotPoints();
        }
    } catch (error) {
        console.error("Erro ao buscar os dados da API:", error);
    }
}

getPilotPoints();

function nextPilots() {
    indexTeam++;
    getPilotPoints();
}

function previousPilots() {
    indexTeam--;
    if (indexTeam < 0) indexTeam = 0;
    getPilotPoints();
}
