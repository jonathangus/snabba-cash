import * as React from 'react'
import { ReactNotificationOptions, store } from 'react-notifications-component'

type Options = {
  title?: string
}

type Toast = (message: string | React.ReactNode, options?: Options) => void

type ToastType = ReactNotificationOptions['type']

const base = (toastType: ToastType): Toast => {
  return (message, options) => {
    store.addNotification({
      title: options?.title,
      message: message,
      type: toastType,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    })
  }
}

const warning: Toast = base('warning')
const success: Toast = base('success')
const error: Toast = base('danger')
const info: Toast = base('info')

const toast = {
  warning,
  success,
  error,
  info,
}

export default toast
