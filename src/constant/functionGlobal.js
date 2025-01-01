import Swal from 'sweetalert2'

export function formatRupiah(value) {
  // Ensure the value is a number, and fix any decimals
  const number = parseFloat(value).toFixed(0)

  // Format with thousand separators
  return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function toDecimal(value) {
  return typeof value === 'number'
    ? new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    : value
}

export function swalError(title, message) {
  return Swal.fire({
    title: `${title}`,
    text: `${message || 'An unexpected error occurred'}`,
    icon: 'warning',
    willOpen: () => {
      // Apply inline CSS to set z-index for SweetAlert modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.style.zIndex = '9999' // Set a high z-index to make sure it's on top
      }
    },
  })
}

export function swalSuccess(message) {
  return Swal.fire({
    title: 'Success for An Action',
    text: `${message}`,
    icon: 'success',
    willOpen: () => {
      // Apply inline CSS to set z-index for SweetAlert modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.style.zIndex = '9999' // Set a high z-index to make sure it's on top
      }
    },
  })
}

export function swalConfirm(message, buttonMessage) {
  return Swal.fire({
    title: 'Are you sure?',
    text: `${message}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `${buttonMessage || 'Ya, Lakukan'} ?`,
    willOpen: () => {
      // Apply inline CSS to set z-index for SweetAlert modal
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer) {
        swalContainer.style.zIndex = '9999' // Set a high z-index to make sure it's on top
      }
    },
  })
}

export function formatDate(date) {
  if (!date || isNaN(Date.parse(date))) {
    return '' // Return empty string if the date is invalid
  }

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // months are 0-based, so add 1
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getDateTimeString(date = new Date(), includeTime = false) {
  const parsedDate = new Date(date)

  // Check for invalid date
  // if (isNaN(parsedDate.getTime())) {
  //   throw new Error('Invalid date');
  // }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Month is 0-indexed, so add 1
  const day = String(parsedDate.getDate()).padStart(2, '0')

  const datePart = `${month}/${day}/${year}`

  if (includeTime) {
    const hours = String(parsedDate.getHours()).padStart(2, '0')
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0')
    const seconds = String(parsedDate.getSeconds()).padStart(2, '0')

    // Return date and time in MM/DD/YYYY HH:MM:SS format
    return `${datePart} ${hours}:${minutes}:${seconds}`
  }

  // Return only the date in MM/DD/YYYY format
  return datePart
}
