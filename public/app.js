// Load existing data if editId is present in URL
document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('editId');
  if (editId) {
    const res = await fetch(`/api/bookings/${editId}`);
    const booking = await res.json();
    document.getElementById('bookingId').value = booking._id;
    document.getElementById('guestName').value = booking.guestName;
    document.getElementById('roomNumber').value = booking.roomNumber;
    document.getElementById('checkInDate').value = booking.checkInDate.split('T')[0];
    document.getElementById('checkOutDate').value = booking.checkOutDate.split('T')[0];
    document.getElementById('numberOfGuests').value = booking.numberOfGuests;
    document.getElementById('roomType').value = booking.roomType;
  }

  loadBookingTable();
});

document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const bookingId = document.getElementById('bookingId').value;

  const booking = {
    guestName: document.getElementById('guestName').value,
    roomNumber: document.getElementById('roomNumber').value,
    checkInDate: document.getElementById('checkInDate').value,
    checkOutDate: document.getElementById('checkOutDate').value,
    numberOfGuests: document.getElementById('numberOfGuests').value,
    roomType: document.getElementById('roomType').value,
  };

  let response;
  let action;
  if (bookingId) {
    response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    action = "updated";
  } else {
    response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    action = "created";
  }

  const result = await response.json();
  if (response.ok) {
    showMessage(`Booking ${action} successfully`, "success");
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingId').value = '';
    loadBookingTable();
  } else {
    showMessage(result.message || "Error occurred", "danger");
  }
});

function showMessage(message, type) {
  const msgBox = document.getElementById('messageBox');
  msgBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => msgBox.innerHTML = '', 3000);
}

async function loadBookingTable() {
  const res = await fetch('/api/bookings');
  const bookings = await res.json();

  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  bookings.forEach(booking => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${booking.guestName}</td>
      <td>${booking.roomNumber}</td>
      <td>${booking.checkInDate}</td>
      <td>${booking.checkOutDate}</td>
      <td>${booking.numberOfGuests}</td>
      <td>${booking.roomType}</td>
      <td>${booking.status || 'Confirmed'}</td>
      <td>
        <button class="btn btn-primary btn-sm me-2" onclick="editBooking('${booking._id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="deleteBooking('${booking._id}')"><i class="fas fa-trash"></i></button>
      </td>`;
    tbody.appendChild(row);
  });
}

async function editBooking(id) {
  window.location.href = `index.html?editId=${id}`;
}

async function deleteBooking(id) {
  if (confirm("Are you sure you want to delete this booking?")) {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    loadBookingTable();
  }
}
