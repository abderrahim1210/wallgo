import React from 'react'

interface EmptyContentProps {
    text: string;
    icon: React.ReactNode;
}

export const EmptyContent: React.FC<EmptyContentProps> = ({ text, icon }) => {
    return (
        <div className="px-10 py-10 flex justify-center items-center">
            <div className="empty-content">
                <div className="empty-content-item text-2xl font-semibold">
                    <div className='[&>svg]:w-14 [&>svg]:h-14 [&>svg]:stroke-[1.5] flex justify-center'>
                        {icon}
                    </div>
                    <h4 className='w-70 text-center'>{text}</h4>
                </div>
            </div>
        </div>
    )
}
