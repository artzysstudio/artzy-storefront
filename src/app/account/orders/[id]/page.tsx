import { api } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await api.commerce.getOrder(id);

  if (!order) {
    notFound();
  }

  // Handcrafted Journey Statuses
  const journeySteps = [
    'Order Received', 'Artwork Preparation', 'Quality Inspection', 'Packaging',
    'Handed to Courier', 'In Transit', 'Out for Delivery', 'Delivered'
  ];
  
  // Mock current step based on status
  let currentStepIndex = 1; // Default mock progress
  if (order.status === 'Processing') currentStepIndex = 1;
  if (order.status === 'Shipped') currentStepIndex = 4;
  if (order.status === 'Delivered') currentStepIndex = 7;

  const progressPercentage = (currentStepIndex / (journeySteps.length - 1)) * 100;

  return (
    <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '80vh', maxWidth: '800px' }}>
      <Link href="/account" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        &larr; Back to Account
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Order {order.id}</h1>
          <div style={{ color: 'var(--text-muted)' }}>Placed on {new Date(order.date).toLocaleDateString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Total: ₹{order.total.toLocaleString('en-IN')}
          </div>
          <button className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => {}}>
            Download GST Invoice
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.2rem' }}>The Handcrafted Journey</h2>
        
        {/* Progress Bar Container */}
        <div style={{ position: 'relative', marginBottom: '3rem', padding: '0 10px' }}>
          {/* Background Track */}
          <div style={{ height: '4px', background: 'var(--border-color)', width: '100%', position: 'absolute', top: '10px', left: 0, zIndex: 1 }}></div>
          {/* Fill Track */}
          <div style={{ height: '4px', background: 'var(--text-primary)', width: `${progressPercentage}%`, position: 'absolute', top: '10px', left: 0, zIndex: 2, transition: 'width 0.5s ease' }}></div>
          
          {/* Dots and Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 3 }}>
            {journeySteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                  <div style={{ 
                    background: isCompleted ? 'var(--text-primary)' : 'var(--border-color)', 
                    width: '24px', height: '24px', 
                    borderRadius: '50%', 
                    border: '4px solid var(--bg-secondary)',
                    boxShadow: isCurrent ? '0 0 0 2px var(--text-primary)' : 'none',
                    marginBottom: '0.8rem'
                  }}></div>
                  <div style={{ fontSize: '0.7rem', textAlign: 'center', color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isCurrent ? 'bold' : 'normal', lineHeight: '1.2' }}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
              <div style={{ fontWeight: '500' }}>{journeySteps[currentStepIndex]}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Courier</div>
              <div style={{ fontWeight: '500' }}>{order.courier}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracking Number (AWB)</div>
              <div style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}>{order.trackingNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
