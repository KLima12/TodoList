 function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const csrftoken = getCookie('csrftoken');

baseURL = `http://127.0.0.1:8000/api`



async function get_tasks() { 
    try {
        const response = await fetch(`${baseURL}/`);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const task = await response.json();
        return task
    } catch (error) { 
        console.error("Erro ao buscar todos os posts: ", error.message);
    }
}



async function view_tasks() { 
    const tasks = await get_tasks()
    const ul = document.getElementById('listTask')
    ul.innerHTML = '' // Limpando a lista antes de adicionar
    tasks.forEach(task => {
        const li = document.createElement("li");
        const btnEditar = document.createElement('button')
        btnEditar.innerHTML = "Editar"
        li.innerHTML = `
            <strong>${task.title}</strong><br>
            📝 ${task.description}<br>
            📅 Prazo: ${task.deadline_date}<br>
            🕒 Criado em: ${new Date(task.creation_date).toLocaleString()}<br>
            ✅ Status: ${task.status_display}
        `; 
        ul.appendChild(li)
        ul.appendChild(btnEditar)
        btnEditar.addEventListener("click", (event)=> { 
            criarForm(task, event.target)
        })
    });
}
view_tasks();

async function createTask(formData) { 
    try { 
        const response = await fetch(`${baseURL}/`, { 
            method: 'POST',
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body:JSON.stringify(Object.fromEntries(formData)), // Convertendo em json os dados passados no formData
        })
        if (!response.ok) { 
            const data = await response.json();
            console.log("Resposta: ", data)
        } else { 
            view_tasks(); // Aqui eu queria recarregar a lista adicionando a nova tarefa
        }
         
        
    } catch(error) { 
        console.error("Erro")
    }
}

async function editTask(task, dados) { 
    try { 
        console.log("dados: ",dados)
        const res = await fetch(`${baseURL}/${task.id}/`, { 
            method: "PUT", 
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(dados),
        })
        if (!res.ok) { 
            const data = await response.json();
            console.log("Resposta: ", data);
        }else { 
            view_tasks();
        }
    }  catch(error) { 
        console.error("Erro")
    }
    
    

}



const form = document.getElementById("adicionarTarefa");
form.addEventListener("submit", async function(event){ 
    event.preventDefault()
    const formData = new FormData(form);
    createTask(formData) 
})

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

function criarForm(task, botaoClicado) { 
    const itemPai = botaoClicado.parentElement;
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
    }

    divFormulario.innerHTML = `
        <form action="."  method="PUT" id="formEdicao">
            <input type="text" name="title" value="${task.title}">
            <textarea name="description">${task.description}</textarea>
            <input type="date" name="date" value="${task.deadline_date}">
        </form>
    `

    divFormulario.querySelector('form').appendChild(selectedStatus)

    // botão de salvar
    const btnSave = document.createElement('button');
    btnSave.type = 'submit';
    btnSave.textContent = 'Salvar';
    divFormulario.querySelector('form').appendChild(btnSave);

    itemPai.appendChild(divFormulario);

    const formEdicao = document.getElementById('formEdicao');
    console.log(formEdicao)
    formEdicao.addEventListener('submit', async function(event){ 
        event.preventDefault();
        const formData = new FormData(formEdicao);
        const dados = Object.fromEntries(formData.entries());
        console.log(task.id)
        editTask(task, dados);
    })
}

  
