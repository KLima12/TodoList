baseURL = `http://127.0.0.1:8000/api/`
async function get_tasks() { 
    try {
        const response = await fetch(`${this.baseURL}`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const task = await response.json();
        return task
    } catch { 
        console.error("Erro ao buscar todos os posts: ", error.message);
        throw error;
    }
}

async function view_tasks() { 
    const tasks = await get_tasks()
    const ul = document.getElementById('listTask')
    tasks.forEach(task => {
        console.log(task)
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${task.title}</strong><br>
            📝 ${task.description}<br>
            📅 Prazo: ${task.deadline_date}<br>
            🕒 Criado em: ${new Date(task.creation_date).toLocaleString()}<br>
            ✅ Status: ${task.status ? "Concluída" : "Pendente"}
        `; 
        ul.appendChild(li)
    });
}
get_tasks()
view_tasks()