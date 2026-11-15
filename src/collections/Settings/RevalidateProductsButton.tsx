'use client';

import { Button, useField } from '@payloadcms/ui';

export default function RevalidateProducts() {
    return (
        <div>
            <Button
                buttonStyle="secondary"
                onClick={async () => {
                    await fetch('/api/revalidate/products', {
                        method: 'POST',
                    });
                }}
            >
                Revalidate Products
            </Button>
        </div>
    );
}