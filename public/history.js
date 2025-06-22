document.addEventListener('DOMContentLoaded', loadHistory);

document.getElementById('searchInput').addEventListener('input', loadHistory);

async function loadHistory() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const res = await fetch('/api/bookings');
  const bookings = await res.json();


  const tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '';

  bookings
    .filter(b => b.guestName.toLowerCase().includes(searchQuery))
    .forEach(booking => {
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
          <button class="btn btn-primary btn-sm me-2" onclick="startEdit('${booking._id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteBooking('${booking._id}')"><i class="fas fa-trash"></i></button>
        </td>`;
      tbody.appendChild(row);
    });
}

async function deleteBooking(id) {
  if (confirm("Are you sure you want to delete this booking?")) {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    loadHistory();
  }
}

function startEdit(id) {
  window.location.href = `index.html?editId=${id}`;
}
