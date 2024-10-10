function optionSelect() {
    const selected = document.getElementById('settingsOption').value;
    const changePassword = document.getElementById('changePassword');

    if (selected === 'change-password') {
        changePassword.style.display = 'block';
    } else {
        changePassword.style.display = 'none';
    }

}

// nav menu script for toggling when in mobile
const menuToggle = document.getElementById('menuToggle');
const navbarDefault = document.getElementById('navbar-default');
const navItems = document.getElementById('navItems');

menuToggle.addEventListener('click', () => {
  
  navbarDefault.classList.toggle('hidden');

  
  if (navbarDefault.classList.contains('hidden')) {
    menuToggle.setAttribute('aria-expanded', 'false');
  } else {
    menuToggle.setAttribute('aria-expanded', 'true');
  }
});

// Optional: Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
  if (!navbarDefault.contains(event.target) && !menuToggle.contains(event.target)) {
    navbarDefault.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    const isHidden = commentsSection.classList.contains('hidden');

    // Toggle the hidden class
    commentsSection.classList.toggle('hidden');

    // Change button text based on visibility
    const button = document.querySelector(`button[onclick="toggleComments(${postId})"]`);
    button.textContent = isHidden ? "Hide Comments" : "Show Comments";
  }

  function openChangePasswordModal(userId) {
    document.getElementById('userId').value = userId;
    document.getElementById('changePasswordModal').classList.add('active');
}

function closeChangePasswordModal() {
    document.getElementById('changePasswordModal').classList.remove('active');
}



setTimeout(() => {
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    if (successAlert) {
        successAlert.classList.add('animate-fadeOut');
        successAlert.addEventListener('animationend', () => successAlert.style.display = 'none');
      }
      
      if (errorAlert) {
        errorAlert.classList.add('animate-fadeOut');
        errorAlert.addEventListener('animationend', () => errorAlert.style.display = 'none');
      }
  }, 3000);


  