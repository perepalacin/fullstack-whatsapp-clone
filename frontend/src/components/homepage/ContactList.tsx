import React from 'react'
import useFetchContacts from '../../hooks/useFetchContacts';

const ContactList = () => {
    const { isLoading, contacts } = useFetchContacts();

  return (
    <div>
        {contacts.map((item) => {
            return (
                <p>{item.username}</p>
            )
        })}
    </div>
  )
}

export default ContactList