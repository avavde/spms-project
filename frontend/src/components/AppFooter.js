import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://iotsystems.kz/spms.html" target="_blank" rel="noopener noreferrer">
          УСУП
        </a>
        <span className="ms-1">&copy; 2024 ООО «АйоТ Системз».</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Ознакомиться с </span>
        <a href="https://iotsystems.kz/spmslicense.html" target="_blank" rel="noopener noreferrer">
          лицензионным соглашением
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
