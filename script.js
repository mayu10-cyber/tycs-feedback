const form = document.getElementById('feedbackForm');
const toggleBtn = document.getElementById('toggleBtn');

// Toggle form visibility
toggleBtn.addEventListener('click', () => {
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('userName').value.trim(),
    department: document.getElementById('userDept').value.trim(),
    rating: document.getElementById('userRating').value.trim(),
    feedback: document.getElementById('userFeedback').value.trim(),
  };

  // Validate
  if (!formData.name || !formData.department || !formData.rating || !formData.feedback) {
    alert('Please fill out all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    document.getElementById('message').innerText = result.message;
    form.reset();
    form.style.display = 'none'; // Hide form after submit
    loadFeedback(); // Reload feedback
  } catch (err) {
    document.getElementById('message').innerText = 'Something went wrong!';
    console.error(err);
  }
});

async function loadFeedback() {
  const response = await fetch('http://localhost:5000/api/feedback');
  const feedbackList = await response.json();

  const tbl = document.getElementById('feedbackTable');
  tbl.innerHTML = '';

  if (feedbackList.length > 0) {
    const fb = feedbackList[0]; // show latest one
    const wrapper = document.createElement('div');
    wrapper.className = 'feedback-wrapper';

    const topRow = document.createElement('div');
    topRow.className = 'top-row';
    topRow.innerHTML = `
      <div class="feedback-name">${fb.name}</div>
      <div class="feedback-stars">${'★'.repeat(Math.floor(fb.rating))}${fb.rating % 1 ? '☆' : ''}</div>
    `;

    const service = document.createElement('div');
    service.className = 'feedback-service';
    service.innerText = fb.department;

    const comment = document.createElement('div');
    comment.className = 'comment-box';
    comment.innerText = fb.feedback;

    wrapper.appendChild(topRow);
    wrapper.appendChild(service);
    wrapper.appendChild(comment);

    tbl.appendChild(wrapper);
  }
}

loadFeedback();
