document.addEventListener('DOMContentLoaded', () => {
	const mainInput = document.querySelector('.todo__main-input');
	const noteList = document.querySelector('.todo__list');
	const toggleAllBtn = document.querySelector('.todo__all-btn');
	const noteCount = document.querySelector('.todo__count');
	const filterButtons = document.querySelectorAll('.todo__filter-btn');
	const clearCompletedBtn = document.querySelector('.todo__clear');
	const footer = document.querySelector('.todo__footer');

	mainInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' && mainInput.value.trim()) {
					addNote(mainInput.value.trim());
					mainInput.value = '';
					updateUI();
			}
	});

	toggleAllBtn.addEventListener('click', () => {
			const items = document.querySelectorAll('.todo__item');
			const shouldCheck = Array.from(items).some(item => !item.classList.contains('_completed'));
			console.log(Array.from(items));
			items.forEach(item => {
					item.classList.toggle('_completed', shouldCheck);
					item.querySelector('.todo__checkbox').checked = shouldCheck;
			});
			console.log(Array.from(items));
			updateUI();
	});

	filterButtons.forEach(btn => {
			btn.addEventListener('click', () => {
					document.querySelector('.todo__filter-btn._active-filter').classList.remove('_active-filter');
					btn.classList.add('_active-filter');
					filterItems(btn.dataset.filter);
			});
	});

	clearCompletedBtn.addEventListener('click', () => {
			const completedItems = document.querySelectorAll('.todo__item._completed');
			completedItems.forEach(item => item.remove());
			updateUI();
	});

	function addNote(text) {
			const noteItem = document.createElement('li');
			noteItem.className = 'todo__item';
			noteItem.innerHTML = `
					<input type="checkbox" class="todo__checkbox">
					<label class="todo__icon"></label>
					<div class="todo__text">${text}</div>
					<span class="todo__del-item">✖</span>
			`;
			noteList.children.length ? noteList.insertBefore(noteItem, noteList.children[0]) : noteList.appendChild(noteItem);

			const checkbox = noteItem.querySelector('.todo__checkbox');
			const deleteBtn = noteItem.querySelector('.todo__del-item');
			const noteText = noteItem.querySelector('.todo__text');

			checkbox.addEventListener('change', () => {
					noteItem.classList.toggle('_completed', checkbox.checked);
					updateUI();
			});

			deleteBtn.addEventListener('click', () => {
					noteItem.remove();
					updateUI();
			});

			noteText.addEventListener('dblclick', () => {
					const input = document.createElement('input');
					input.type = 'text';
					input.className = 'todo__input';
					input.value = noteText.textContent;
					noteItem.replaceChild(input, noteText);
					input.focus();

					input.addEventListener('blur', () => {
							noteText.textContent = input.value;
							noteItem.replaceChild(noteText, input);
					});

					input.addEventListener('keypress', (e) => {
							if (e.key === 'Enter') {
									noteText.textContent = input.value;
									noteItem.replaceChild(noteText, input);
							}
					});
			});
	}

	function updateUI() {
			const items = document.querySelectorAll('.todo__item');
			const completedItems = document.querySelectorAll('.todo__item._completed');
			const activeItems = items.length - completedItems.length;

			noteCount.textContent = `${activeItems} items left`;
			toggleAllBtn.style.display = items.length ? 'inline-block' : 'none';
			footer.style.display = items.length ? 'flex' : 'none';
			clearCompletedBtn.style.display = completedItems.length ? 'inline-block' : 'none';


			if (items.length && completedItems.length === items.length) {
				toggleAllBtn.classList.add('_all');
			} else {
				toggleAllBtn.classList.remove('_all');
			}

			filterItems(document.querySelector('.todo__filter-btn._active-filter').dataset.filter);
	}

	function filterItems(filter) {
			const items = document.querySelectorAll('.todo__item');
			items.forEach(item => {
					switch (filter) {
							case 'all':
									item.style.display = 'flex';
									break;
							case 'active':
									item.style.display = item.classList.contains('_completed') ? 'none' : 'flex';
									break;
							case 'completed':
									item.style.display = item.classList.contains('_completed') ? 'flex' : 'none';
									break;
					}
			});
	}
});