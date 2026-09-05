import { api } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} | Artzy's Studio`,
    description: 'Track your order status and details.',
    robots: { index: false, follow: false },
    alternates: { canonical: `/account/orders/${encodeURIComponent(id)}/` },
  };
}

export function generateStaticParams() {
  return [{ id: 'ARTZY-0000' }];
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === 'ARTZY-0000') return <main className="container" style={{ padding: '8rem 1.25rem', minHeight: '70vh', maxWidth: '720px', textAlign: 'center' }}>
    <h1>Track a confirmed order</h1>
    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Order tracking appears here only for an order returned by Artzy ERP. Sign in to your account or ask the studio with your confirmed order number.</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '24px' }}><Link className="btn" href="/account">Your account</Link><a className="btn btn-solid" href="https://wa.me/919158680722">Ask on WhatsApp</a></div>
  </main>;
  const order = await api.commerce.getOrder(id);

  if (!order) {
    notFound();
  }

  // Handcrafted Journey Statuses
  const journeySteps = [
    'Order Received', 'Artwork Preparation', 'Quality Inspection', 'Packaging',
    'Handed to Courier', 'In Transit', 'Out for Delivery', 'Delivered'
  ];
  
  const statusStep: Record<string, number> = { Processing: 1, Shipped: 4, 'In Transit': 5, 'Out for Delivery': 6, Delivered: 7 };
  const currentStepIndex = statusStep[order.status] ?? 0;

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
              <div style={{ fontWeight: '500' }}>{order.courier || 'Awaiting courier assignment'}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracking Number (AWB)</div>
              <div style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem' }}>{order.trackingNumber || 'Not assigned yet'}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
