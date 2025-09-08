 function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const csrftoken = getCookie('csrftoken');

const baseURL = `http://127.0.0.1:8000/api`;
let allTasks = []; // Armazenar todas as tarefas localmente


// --- Funções de Renderização ---

function createTaskListItem(task) {
    const li = document.createElement("li");
    li.dataset.taskId = task.id; // Adiciona um identificador ao elemento
    li.innerHTML = `
            <strong>${task.title}</strong><br>
            📝 ${task.description}<br>
            📅 Prazo: ${task.deadline_date}<br>
            🕒 Criado em: ${new Date(task.creation_date).toLocaleString()}<br>
            ✅ Status: ${task.status_display}
            <br>
        `;

    const btnEditar = document.createElement('button');
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => criarForm(task, li));

    const btnDelete = document.createElement('button');
    btnDelete.textContent = "Delete";
    btnDelete.style.background = 'red';
    btnDelete.style.color = 'white';
    btnDelete.addEventListener("click", () => deleteForm(task));

    li.appendChild(btnEditar);
    li.appendChild(btnDelete);
    return li;
}

function renderAllLists() {
    // Garante que qualquer formulário de edição aberto seja removido antes de redesenhar
    const existingEditForm = document.querySelector('.form-edit');
    if (existingEditForm) {
        existingEditForm.remove();
    }

    // Filtra pendentes no array de allTasks. Retorna um array.
    const pendingTasks = allTasks.filter(task => task.status !== 'concluida');
    console.log(pendingTasks)
    const completedTasks = allTasks.filter(task => task.status === 'concluida');

    // Pegando ul
    const ulPending = document.getElementById('listTask');
    ulPending.innerHTML = '';
    pendingTasks.forEach(task => {
        // Chamando pra renderizar na tela
        ulPending.appendChild(createTaskListItem(task));
    });

    const ulCompleted = document.getElementById('completes');
    ulCompleted.innerHTML = '';
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.taskId = task.id;
        li.innerHTML = `
            <strong>${task.title}</strong><br>
            📝 ${task.description}<br>
            📅 Prazo: ${task.deadline_date}<br>
            🕒 Criado em: ${new Date(task.creation_date).toLocaleString()}<br>
            ✅ Status: ${task.status_display}
        `;
        ulCompleted.appendChild(li);
    });
}

// --- Requisições à API ---

// Fazendo requisição para retornar tudo: Tarefas concluidas, tarefas pendente... Vai me retornar tudo, literalmente.
async function fetchAllTasks() {
    try {
        const response = await fetch(`${baseURL}/`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        allTasks = await response.json(); // Fazendo o allTasks receber o json retornado do response.
        renderAllLists();
    } catch (error) {
        console.error("Erro ao buscar todos os posts: ", error.message);
    }
}

async function createTask(formData) {
    try {
        const response = await fetch(`${baseURL}/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        if (!response.ok) {
            const data = await response.json();
            console.error("Erro ao criar tarefa: ", data);
        } else {
            const newTask = await response.json(); // Pegando a nova tarefa.
            allTasks.push(newTask); // Atualiza o estado local
            renderAllLists(); // Redesenha as listas
        }
    } catch (error) {
        console.error("Erro")
    }
}

const form = document.getElementById("adicionarTarefa");
form.addEventListener("submit", async function(event){ 
    event.preventDefault()
    const formData = new FormData(form);
    await createTask(formData);
    form.reset();
})

async function editTask(task, dados) {
    try {
        const res = await fetch(`${baseURL}/${task.id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(dados),
        })
        if (!res.ok) {
            const data = await res.json();
            console.error("Erro ao editar: ", data);
        } else {
            // 1. Pega a tarefa atualizada que o servidor enviou de volta
            const updatedTask = await res.json();

            // 2. Encontra a posição (o "índice") da tarefa antiga no nosso array local
            const index = allTasks.findIndex(t => t.id === updatedTask.id);

            // 3. Se a tarefa foi encontrada no array...
            if (index !== -1) {
                // 4. ...substitui a tarefa antiga pela nova, já com os dados atualizados.
                allTasks[index] = updatedTask;
            }

            // 5. Manda redesenhar todas as listas na tela com os dados mais recentes.
            renderAllLists();
        }
    } catch (error) {
        console.error("Erro")
    }
}

async function deleteForm(task) {
    try {
        const res = await fetch(`${baseURL}/${task.id}/`, {
            method: "DELETE",
            headers: { "X-CSRFToken": csrftoken }
        });

        if (res.ok) {
            // Remove a tarefa do array local
            allTasks = allTasks.filter(t => t.id !== task.id);
            renderAllLists();
        } else {
            alert("Deu erro ao deletar contato!")
        }
    } catch (error) {
        console.error("Erro ao deletar: ", error);
        alert("Ocorreu um erro de rede ao tentar deletar a tarefa.");
    }
}

// --- Funções de UI ---

function criarSelectedStatus(opcoes, valorAtual) { 
        const select = document.createElement('select');
        select.name = 'status';
        opcoes.forEach(op => { 
            const option =  document.createElement('option');
            option.value = op.value;
            option.textContent = op.text;

            if (op.value === valorAtual) { 
                option.selected = true;
            } 
            select.appendChild(option);
        });
    
        return select;
}

function criarForm(task, listItem) {
    const divFormulario = document.createElement('div');
    divFormulario.className = 'form-edit';
    const divExistente = document.querySelector('.form-edit');

    const opcoesStatus = [
        {value: 'pendente', text: "Pendente"},
        {value: 'concluida', text: 'Concluída'}
    ]

    const selectedStatus = criarSelectedStatus(opcoesStatus, task.status);

    if (divExistente) { 
        alert("Por favor, feche ou salve o contato que já está sendo editado!");
        return;
    }

    divFormulario.innerHTML = `
        <form action="."  method="PUT" id="formEdicao">
            <input type="text" name="title" value="${task.title}">
            <textarea name="description">${task.description}</textarea>
            <input type="date" name="deadline_date" value="${task.deadline_date}">
        </form>
    `

    divFormulario.querySelector('form').appendChild(selectedStatus)

    // botão de salvar
    const btnSave = document.createElement('button');
    btnSave.type = 'submit';
    btnSave.textContent = 'Salvar';
    divFormulario.querySelector('form').appendChild(btnSave);

    listItem.appendChild(divFormulario);

    const formEdicao = document.getElementById('formEdicao');
    formEdicao.addEventListener('submit', async function(event){ 
        event.preventDefault();
        const formData = new FormData(formEdicao);
        const dados = Object.fromEntries(formData.entries());
        // A função editTask vai chamar renderAllLists, que por sua vez removerá o formulário.
        await editTask(task, dados);
    })
}


// --- Inicialização ---
document.addEventListener('DOMContentLoaded', fetchAllTasks);
