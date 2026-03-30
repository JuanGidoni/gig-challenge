/**
 * @module ui/pages/HomePage
 * @description
 * The main (and only) page of the SportX betting application.
 *
 * Composes the events list and bet slip panel side by side.
 * Connects the two UI regions by passing shared state and callbacks.
 */

import { useEvents } from "../hooks/useEvents";
import { useBetSlip } from "../hooks/useBetSlip";
import EventsSection from "../components/events-section/EventsSection";
import BetSlipSection from "../components/bet-slip-section/BetSlipSection";

/**
 * HomePage component.
 *
 * @returns {JSX.Element}
 */
export default function HomePage() {
  const { events } = useEvents();
  const betSlip = useBetSlip();

  return (
    <main className="page-layout">
      <EventsSection
        events={events}
        selections={betSlip.selections}
        onToggle={betSlip.handleToggle}
      />

      <BetSlipSection
        selections={betSlip.selections}
        amount={betSlip.amount}
        amountInput={betSlip.amountInput}
        amountError={betSlip.amountError}
        total={betSlip.total}
        potentialGain={betSlip.potentialGain}
        onRemove={betSlip.handleRemove}
        onAmountChange={betSlip.handleAmountChange}
        onIncrement={betSlip.handleIncrement}
        onDecrement={betSlip.handleDecrement}
      />
    </main>
  );
}
