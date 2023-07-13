import React from 'react'
import editProfile from '../../../assets/editProfile.svg'

export function EditButton({ size, fontSize }) {
    return (
        <button className='flex gap-3 items-center font-[600] text-[16px]'>
            <img src={editProfile} alt="" className={size} />
            <div className={fontSize}>
                <p className='text-[#FF8399]'>Editar</p>
            </div>
        </button>
    )
}