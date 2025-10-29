/* main.js - Interactivity for Amigos do Bem */
document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const menuList = document.getElementById('menu-list');
  if(menuToggle && menuList){
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuList.setAttribute('aria-hidden', String(expanded));
      if(expanded) menuList.style.display = 'none';
      else menuList.style.display = 'flex';
    });
  }

  // Render projects (example data)
  const projectsData = [
    {id:1, title:'Educação para Todos', cat:'educacao', excerpt:'Aulas de reforço, oficinas e materiais didáticos.'},
    {id:2, title:'Alimentando Vidas', cat:'saude', excerpt:'Cestas básicas e ação de nutricionistas.'},
    {id:3, title:'Saúde Comunitária', cat:'saude', excerpt:'Atendimentos e campanhas de prevenção.'},
    {id:4, title:'Reflorestamento Local', cat:'meioambiente', excerpt:'Ações de plantio e educação ambiental.'},
    {id:5, title:'Oficinas Profissionalizantes', cat:'educacao', excerpt:'Formação para geração de renda.'}
  ];
  const projectsList = document.getElementById('projects-list');
  if(projectsList){
    function renderProjects(filter='', q=''){
      projectsList.innerHTML = '';
      const filtered = projectsData.filter(p => (filter==='all' || !filter || p.cat===filter) && (!q || p.title.toLowerCase().includes(q)));
      if(filtered.length===0){ projectsList.innerHTML = '<p>Nenhum projeto encontrado.</p>'; return; }
      filtered.forEach(p => {
        const art = document.createElement('article');
        art.className = 'card';
        art.innerHTML = `
          <img src="assets/images/projeto-${p.id}.svg" alt="${p.title}" loading="lazy">
          <div class="card-body">
            <h3 class="card-title">${p.title}</h3>
            <p class="card-excerpt">${p.excerpt}</p>
            <div class="card-meta">
              <span class="badge">${p.cat}</span>
              <a class="btn" href="projeto-detalhe.html?id=${p.id}">Ver detalhes</a>
            </div>
          </div>
        `;
        projectsList.appendChild(art);
      });
    }
    const filtro = document.getElementById('filtro-cat');
    const busca = document.getElementById('busca');
    if(filtro) filtro.addEventListener('change', e => renderProjects(e.target.value, busca ? busca.value.toLowerCase() : ''));
    if(busca) busca.addEventListener('input', e => renderProjects(filtro ? filtro.value : '', e.target.value.toLowerCase()));
    renderProjects('all','');
  }

  // Newsletter
  const nlForm = document.getElementById('newsletter-form');
  if(nlForm){
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Inscrição realizada. Obrigado!', 'success');
      nlForm.reset();
    });
  }

  // Toast system
  const toastsContainer = document.createElement('div');
  toastsContainer.className = 'toasts-container';
  document.body.appendChild(toastsContainer);
  window.showToast = function(message='Notificação', type='info', timeout=3000){
    const t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.innerHTML = `<div class="toast-body">${message}</div><button class="toast-close" aria-label="Fechar">&times;</button>`;
    toastsContainer.appendChild(t);
    // show
    requestAnimationFrame(()=> t.classList.add('show'));
    // close handler
    t.querySelector('.toast-close').addEventListener('click', ()=> {
      t.classList.remove('show');
      setTimeout(()=> t.remove(), 300);
    });
    if(timeout>0){
      setTimeout(()=> { t.classList.remove('show'); setTimeout(()=> t.remove(), 300); }, timeout);
    }
  };

  // Cadastro form: masks for CPF, telefone, CEP and validation
  const cpfEl = document.getElementById('cpf');
  const telEl = document.getElementById('telefone');
  const cepEl = document.getElementById('cep');

  function maskCPF(v){ return v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'); }
  function maskTel(v){ v = v.replace(/\D/g,''); if(v.length>10) return v.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3'); return v.replace(/(\d{2})(\d{4})(\d{4})/,'($1) $2-$3'); }
  function maskCEP(v){ return v.replace(/\D/g,'').replace(/(\d{5})(\d{3})/,'$1-$2'); }

  if(cpfEl) cpfEl.addEventListener('input', e => e.target.value = maskCPF(e.target.value));
  if(telEl) telEl.addEventListener('input', e => e.target.value = maskTel(e.target.value));
  if(cepEl) cepEl.addEventListener('input', e => e.target.value = maskCEP(e.target.value));

  const cadastroForm = document.getElementById('cadastro-form');
  if(cadastroForm){
    cadastroForm.addEventListener('submit', e => {
      if(!cadastroForm.checkValidity()){
        e.preventDefault();
        cadastroForm.querySelectorAll(':invalid')[0].focus();
        showToast('Por favor, corrija os campos destacados.', 'danger', 4000);
      } else {
        e.preventDefault();
        showToast('Cadastro enviado com sucesso. Obrigado!', 'success', 3500);
        cadastroForm.reset();
      }
    });
  }

});