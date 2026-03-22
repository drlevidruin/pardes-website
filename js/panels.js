/* Detail modal for content cards
   Note: innerHTML is used here with trusted, same-origin HTML content
   from hidden elements already present in the page DOM. No user input
   is involved. This is safe for this static site context. */
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('detail-modal');
  if (!modal) return;

  var modalImg = modal.querySelector('.detail-modal__image');
  var modalBody = modal.querySelector('.detail-modal__body');
  var closeBtn = modal.querySelector('.detail-modal__close');

  function openModal(card) {
    var img = card.querySelector('.panel__image');
    var detail = card.querySelector('.panel__detail');
    if (!detail) return;

    if (img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalImg.style.display = 'block';
    } else {
      modalImg.style.display = 'none';
    }

    /* Content comes from trusted same-origin hidden elements in the page */
    modalBody.innerHTML = detail.innerHTML;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.panel--card').forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
});
