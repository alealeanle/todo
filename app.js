document.addEventListener('DOMContentLoaded', () => {
	const mainInput = document.querySelector('.todo__main-input');
	const noteList = document.querySelector('.todo__list');
	const toggleAllBtn = document.querySelector('.todo__all-btn');
	const noteCount = document.querySelector('.todo__count');
	const filterButtons = document.querySelectorAll('.todo__filter-btn');
	const clearCompletedBtn = document.querySelector('.todo__clear');
	const footer = document.querySelector('.todo__footer');

	const handleMainInput = () => {
		if (mainInput.value.trim()) {
			addNote(mainInput.value.trim());
			mainInput.value = '';
			updateUI();
		}
	};

	const handleCheckboxChange = (checkbox, noteItem) => {
		noteItem.classList.toggle('_completed', checkbox.checked);
		updateUI();
	};

	const handleDeleteBtnClick = (noteItem) => {
		noteItem.remove();
		updateUI();
	};

	const handleNoteTextDblClick = (noteItem, noteText) => {
		const input = createTextInput(noteText.textContent);
		noteItem.replaceChild(input, noteText);
		input.focus();

		let blurFlag = true;

		const handleInputBlur = () => {
			if (!blurFlag) return;
			finishEditing(input, noteText, noteItem);
			blurFlag = false;
		};

		const handleInputKeyPress = (e) => {
			if (e.key === 'Enter') {
				blurFlag = false;
				finishEditing(input, noteText, noteItem);
			}
		};

		const handleInputKeyDown = (e) => {
			if (e.key === 'Escape') {
				blurFlag = false;
				cancelEditing(input, noteText, noteItem);
			}
		};

		input.addEventListener('blur', handleInputBlur);
		input.addEventListener('keypress', handleInputKeyPress);
		input.addEventListener('keydown', handleInputKeyDown);
	};

	const finishEditing = (input, noteText, noteItem) => {
		noteText.textContent = input.value.trim();
		if (noteText.textContent === '') {
			noteItem.remove();
		} else {
			noteItem.replaceChild(noteText, input);
		}
		updateUI();
	};

	const cancelEditing = (input, noteText, noteItem) => {
		noteItem.replaceChild(noteText, input);
	};

	const createTextInput = (value) => {
		const input = document.createElement('input');
		input.type = 'text';
		input.className = 'todo__input';
		input.value = value;
		return input;
	};

	const attachNoteEvents = (noteItem) => {
		const checkbox = noteItem.querySelector('.todo__checkbox');
		const deleteBtn = noteItem.querySelector('.todo__del-item');
		const noteText = noteItem.querySelector('.todo__text');

		checkbox.addEventListener('change', () => handleCheckboxChange(checkbox, noteItem));
		deleteBtn.addEventListener('click', () => handleDeleteBtnClick(noteItem));
		noteText.addEventListener('dblclick', () => handleNoteTextDblClick(noteItem, noteText));
	};

	const addNote = (text, completed = false, appendToEnd = false) => {
		const noteItem = document.createElement('li');
		noteItem.className = 'todo__item';
		if (completed) noteItem.classList.add('_completed');
		noteItem.innerHTML = `
			<input type="checkbox" class="todo__checkbox" ${completed ? 'checked' : ''}>
			<label class="todo__icon"></label>
			<div class="todo__text">${text}</div>
			<span class="todo__del-item">✖</span>
		`;
		appendToEnd ? noteList.appendChild(noteItem) : noteList.insertBefore(noteItem, noteList.children[0]);

		attachNoteEvents(noteItem);
	};

	const updateUI = () => {
		const items = document.querySelectorAll('.todo__item');
		const completedItems = document.querySelectorAll('.todo__item._completed');
		const activeItems = items.length - completedItems.length;

		noteCount.textContent = `${activeItems} items left`;
		toggleAllBtn.style.display = items.length ? 'inline-block' : 'none';
		footer.style.display = items.length ? 'flex' : 'none';
		clearCompletedBtn.style.display = completedItems.length ? 'inline-block' : 'none';

		toggleAllBtn.classList.toggle('_all', items.length && completedItems.length === items.length);

		saveItems();

		filterItems(document.querySelector('.todo__filter-btn._active-filter').dataset.filter);
	}

	const filterItems = (filter) => {
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
	};

	const saveItems = () => {
		const items = [];
		document.querySelectorAll('.todo__item').forEach(item => {
			const text = item.querySelector('.todo__text').textContent;
			const completed = item.classList.contains('_completed');
			items.push({ text, completed });
		});
		localStorage.setItem('items', JSON.stringify(items));
	};

	const loadItems = () => {
		const items = JSON.parse(localStorage.getItem('items')) || [];
		items.forEach(item => addNote(item.text, item.completed, true));
		updateUI();
	};

	const handleToggleAllBtnClick = () => {
		const items = document.querySelectorAll('.todo__item');
		const shouldCheck = Array.from(items).some(item => !item.classList.contains('_completed'));
		items.forEach(item => {
			item.classList.toggle('_completed', shouldCheck);
			item.querySelector('.todo__checkbox').checked = shouldCheck;
		});
		updateUI();
	};

	const handleFilterButtonClick = (btn) => {
		document.querySelector('.todo__filter-btn._active-filter').classList.remove('_active-filter');
		btn.classList.add('_active-filter');
		filterItems(btn.dataset.filter);
	};

	const handleClearCompletedBtnClick = () => {
		const completedItems = document.querySelectorAll('.todo__item._completed');
		completedItems.forEach(item => item.remove());
		updateUI();
	};

	loadItems();

	mainInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			handleMainInput();
		}
	});

	mainInput.addEventListener('blur', handleMainInput);

	toggleAllBtn.addEventListener('click', handleToggleAllBtnClick);

	filterButtons.forEach(btn => {
		btn.addEventListener('click', () => handleFilterButtonClick(btn));
	});

	clearCompletedBtn.addEventListener('click', handleClearCompletedBtnClick);
});