import { rootReducer, RootState } from './store';
import { ingredientsSlice } from './slices/ingredients/index';
import { userSlice } from './slices/user/index';
import { feedSlice } from './slices/feed/feedSlice';
import { burgerConstructorSlice } from './slices/constructor/burgerConstructorSlice';
import { orderSlice } from './slices/orders/orderSlice';

describe('Корневой Редьюсер', () => {
  it('должен правильно инициализироваться со всеми слайсами', () => {
    expect(rootReducer).toBeDefined();
    // Проверяем, что rootReducer вызывается с начальным состоянием
    // и возвращает объект с ожидаемыми свойствами
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    expect(initialState.ingredients).toBe(
      ingredientsSlice.reducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.user).toBe(
      userSlice.reducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.feed).toBe(
      feedSlice.reducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.burger).toBe(
      burgerConstructorSlice.reducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.order).toBe(
      orderSlice.reducer(undefined, { type: '@@INIT' })
    );
  });
});
