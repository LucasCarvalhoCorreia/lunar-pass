import { test, expect } from '../../support';
import { cleanReservationAndTickets, bookSeatForConcurrency } from '../../support/db';

test('Emissão de tickets com sucesso após pagamento aprovado', async ({ app }) => {
  // Arrange
  await cleanReservationAndTickets('LP-9A09L');
  await app.paymentPage.go('LP-9A09L');

  // Act
  await app.paymentPage.fillPaymentForm({ cardNumber: '4242 4242 4242 4242' });
  await app.paymentPage.submit();

  // Assert
  await expect(app.paymentPage.confirmationHeading).toBeVisible();
  await expect(app.paymentPage.paymentStatus).toContainText('Pagamento aprovado! Pode arrumar as malas: a Lua já está esperando por você.');
  await expect(app.paymentPage.reservationCode).toHaveText(/^[A-Z0-9]{6}$/);
  await expect(app.paymentPage.ticketList.first()).toBeVisible();
  await expect(app.paymentPage.paymentStatus).toBeVisible();
});

test('Manter dados na tela quando o pagamento é recusado', async ({ app }) => {
  // Arrange
  await cleanReservationAndTickets('LP-B3KLH');
  await app.paymentPage.go('LP-B3KLH');

  // Act
  await app.paymentPage.fillPaymentForm({ cardNumber: '4000 0000 0000 0002' });
  await app.paymentPage.submit();

  // Assert
  await expect(app.paymentPage.alert).toContainText('Pagamento negado');
  await expect(app.paymentPage.title).toBeVisible();
  await expect(app.paymentPage.cardNumberInput).toHaveValue(/4000/);
  await expect(app.paymentPage.emailInput).toHaveValue('buzz@lunarpass.dev');
});

test('Bloqueio da reserva por concorrência de assentos no momento do processamento', async ({ app }) => {
  // Arrange
  await cleanReservationAndTickets('LP-ALH5M');
  await app.paymentPage.go('LP-ALH5M');
  await app.paymentPage.fillPaymentForm({ cardNumber: '4242 4242 4242 4242' });
  // Simula outra pessoa comprando o assento A1 enquanto o viajante preenche o pagamento
  await bookSeatForConcurrency('LP-ALH5M', 'A1');

  // Act
  await app.paymentPage.submit();

  // Assert
  await expect(app.paymentPage.alert).toContainText('Um dos assentos acabou de ser reservado');
  await expect(app.paymentPage.title).toBeVisible();
});

test('Emissão de tickets com sucesso usando Mastercard', async ({ app }) => {
  // Arrange
  await cleanReservationAndTickets('LP-2801A');
  await app.paymentPage.go('LP-2801A');

  // Act
  await app.paymentPage.fillPaymentForm({ cardNumber: '5555 5555 5555 4444' });
  await app.paymentPage.submit();

  // Assert
  await expect(app.paymentPage.confirmationHeading).toBeVisible();
  await expect(app.paymentPage.paymentStatus).toContainText('Pagamento aprovado! Pode arrumar as malas: a Lua já está esperando por você.');
  await expect(app.paymentPage.reservationCode).toHaveText(/^[A-Z0-9]{6}$/);
});

test('Emissão de tickets negada usando American Express', async ({ app }) => {
  // Arrange
  await cleanReservationAndTickets('LP-Y0Y28');
  await app.paymentPage.go('LP-Y0Y28');

  // Act
  await app.paymentPage.fillPaymentForm({ cardNumber: '3782 822463 10005' });
  await app.paymentPage.submit();

  // Assert
  await expect(app.paymentPage.paymentStatus).toContainText('Pagamento negado pela operadora do cartão.');
});
