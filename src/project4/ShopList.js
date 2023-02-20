import "./ShopList.css";
import {useState} from "react";

function Item({item, onRemoveItem}) {
    return (
        <>
            <li>
                {item}
                <button className="delete" onClick={() => onRemoveItem(item)}>
                    x
                </button>
            </li>
            <br/>
        </>
    );
}

export default function ShopList() {

    const [items, setItems] = useState([]);

    function onSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const input = form.item;
        const newItems = [...items, input.value]
        setItems(newItems);
        form.reset();
    }

    function onRemoveItem(itemToRemove) {
        const newItems = items.filter((item) => {
                return item !== itemToRemove;
            }
        );
        setItems(newItems);
    }

    return (
        <>
            <h1>Project 4: Shopping List</h1>
            <div className="shopping-list">
                <h2>Items To Buy</h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        name="item"
                        placeholder="Add a new item"
                        required={true}
                    />
                    <button>Add</button>
                </form>
                <ul>
                    {items.map((item, index) => (
                        <Item onRemoveItem={onRemoveItem} key={item + index} item={item} />
                    ))}
                </ul>
            </div>
        </>
    );

}