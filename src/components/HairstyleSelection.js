import React from 'react';

const HairstyleSelection = ({ onSelect}) => {

    const hairstyles = [
        { id: 1, name: 'Afro', mg: '/assets/images/afro.png' },
        { id:2, name: 'Braids', img: '/assets/images/braids.png' },
    ];

    return (
        <div className='hairstyle-selection'>
            <h2>Select a hairstyle</h2>
            <div className='hairstyle-list'>
            {hairstyles.map(style => (
                <div
                    key={style.id}
                    className='hairstyle-item'
                    >
                    <img src={style.img} alt={style.name} />
                    <p>{style.name}</p>
                    </div>
            ))}
            </div>
        </div>
    );
};

export default HairstyleSelection;