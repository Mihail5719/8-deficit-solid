'use strict';

// ============================================================================
// Домашнее задание SOLID — ветка 8-solid
// Класс Billing с соблюдением принципа открытости/закрытости (OCP)
// ============================================================================

// ----------------------------------------------------------------------------
// Базовый класс Billing: свойство amount + метод calculateTotal (контракт)
// ----------------------------------------------------------------------------
class Billing {
  constructor(amount) {
    this.amount = amount; // Сумма по условию задачи
  }

  // Базовый метод-контракт: каждый подкласс реализует расчёт по-своему
  calculateTotal() {
    throw new Error(
      'Метод calculateTotal() должен быть реализован в подклассе',
    );
  }
}

// ----------------------------------------------------------------------------
// Тип fixBilling: фиксированный счёт — возвращает amount как результат
// ----------------------------------------------------------------------------
class FixBilling extends Billing {
  calculateTotal() {
    return this.amount;
  }
}

// ----------------------------------------------------------------------------
// Тип hourBilling: amount * число часов
// ----------------------------------------------------------------------------
class HourBilling extends Billing {
  constructor(amount, hours) {
    super(amount);
    this.hours = hours;
  }

  calculateTotal() {
    return this.amount * this.hours;
  }
}

// ----------------------------------------------------------------------------
// Тип itemBilling: amount * число элементов
// ----------------------------------------------------------------------------
class ItemBilling extends Billing {
  constructor(amount, items) {
    super(amount);
    this.items = items;
  }

  calculateTotal() {
    return this.amount * this.items;
  }
}

// ----------------------------------------------------------------------------
// Полиморфизм: функция работает с ЛЮБЫМ типом Billing.
// Нет if / switch / instanceof — код закрыт для модификации (OCP)
// ----------------------------------------------------------------------------
function formatInvoice(label, billing) {
  return `${label}: итого = ${billing.calculateTotal()}`;
}

// ----------------------------------------------------------------------------
// Вывод результатов на страницу и в консоль браузера
// ----------------------------------------------------------------------------
const output = document.getElementById('output');

const invoices = [
  { label: 'fixBilling  (amount = 1000)', billing: new FixBilling(1000) },
  {
    label: 'hourBilling (500/час × 8 часов)',
    billing: new HourBilling(500, 8),
  },
  { label: 'itemBilling (100/шт × 5 штук)', billing: new ItemBilling(100, 5) },
];

invoices.forEach(({ label, billing }) => {
  const line = formatInvoice(label, billing);
  console.log(line); // дублируем в консоль (F12)

  const p = document.createElement('p');
  p.textContent = line;
  output.appendChild(p);
});

// ----------------------------------------------------------------------------
// Проверка OCP: НОВЫЙ тип счёта добавлен без изменения старых классов.
// Billing, FixBilling, HourBilling, ItemBilling и formatInvoice — не тронуты!
// ----------------------------------------------------------------------------
class DiscountBilling extends Billing {
  constructor(amount, discountPercent) {
    super(amount);
    this.discountPercent = discountPercent;
  }

  calculateTotal() {
    return this.amount * (1 - this.discountPercent / 100);
  }
}

const newLine = formatInvoice(
  'discountBilling (1000, скидка 10%)',
  new DiscountBilling(1000, 10),
);
console.log(newLine);

const pNew = document.createElement('p');
pNew.className = 'new-type';
pNew.textContent = newLine + '  ← новый тип без правки старого кода';
output.appendChild(pNew);
