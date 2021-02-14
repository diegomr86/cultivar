export default {
  generateCode(names) {
    let initials = ''
    names.forEach((name) => {
      if (name) {
        name = name.replace('-', ' ')
        const parts = name.split(' ')
        for (let i = 0; i < parts.length; i++) {
          if (parts[i].length > 0 && parts[i] !== '') {
            if (i !== 0) {
              initials += '-'
            }
            initials += parts[i].substr(0, 3)
          }
        }
        initials += '-'
      }
    })
    if (initials === '') {
      initials = 'COD-' + Date.now()
    } else {
      initials += new Date().getFullYear()
    }
    return initials.toUpperCase()
  },
}
