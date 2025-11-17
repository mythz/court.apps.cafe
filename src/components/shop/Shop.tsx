import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useGame } from '../../contexts/GameContext';
import { storageService } from '../../services/storageService';
import type { CustomizationItem } from '../../types/storage.types';

export const Shop: React.FC = () => {
  const { state, equipItem, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'courtroom' | 'gavel' | 'robe' | 'decoration'>('gavel');
  const [inventory, setInventory] = useState<CustomizationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await fetch('/data/customizationItems.json');
      const items: CustomizationItem[] = await response.json();

      const savedInventory = await storageService.getCustomizationInventory();
      const ownedIds = new Set(savedInventory.map(item => item.id));

      const mergedItems = items.map(item => ({
        ...item,
        owned: item.price === 0 || ownedIds.has(item.id)
      }));

      setInventory(mergedItems);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load shop items:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async (item: CustomizationItem) => {
    if (state.coins >= item.price && !item.owned) {
      dispatch({ type: 'SUBTRACT_COINS', payload: item.price });

      const updatedItem = { ...item, owned: true };
      await storageService.saveCustomizationInventory([updatedItem]);

      setInventory(prev =>
        prev.map(i => i.id === item.id ? updatedItem : i)
      );
    }
  };

  const filteredItems = inventory.filter(item => item.category === selectedCategory);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="shop p-8 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Customization Shop</h1>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'menu' })}>
          Back to Menu
        </Button>
      </div>

      <div className="categories flex gap-4 mb-6">
        {(['gavel', 'courtroom', 'robe', 'decoration'] as const).map(cat => (
          <button
            key={cat}
            className={`category-tab px-6 py-3 rounded-lg font-semibold ${
              selectedCategory === cat ? 'bg-yellow-600 text-black' : 'bg-gray-700 text-white'
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="items-grid grid grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="item-card bg-gray-800 p-4 rounded-lg"
          >
            <div className="w-full h-48 bg-gray-700 rounded mb-3 flex items-center justify-center text-6xl">
              {item.category === 'gavel' && '🔨'}
              {item.category === 'courtroom' && '🏛️'}
              {item.category === 'robe' && '👔'}
              {item.category === 'decoration' && '⚖️'}
            </div>
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-3">{item.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-semibold">
                {item.price === 0 ? 'Free' : `${item.price} coins`}
              </span>

              {item.owned ? (
                <Button
                  onClick={() => equipItem(item.id, item.category)}
                  variant="secondary"
                  size="sm"
                >
                  Equip
                </Button>
              ) : (
                <Button
                  onClick={() => handlePurchase(item)}
                  variant="primary"
                  size="sm"
                  disabled={state.coins < item.price}
                >
                  Buy
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
