import { Dropdown, Flowbite, useTheme } from 'flowbite-react';

export function Counter({
  onChange,
  ticketId,
  optionId,
  price,
  initialCount = 0,
  limit,
}: {
  onChange: Function;
  ticketId: string;
  optionId?: string;
  price: number;
  initialCount: number;
  limit: number;
}) {
  const onSelect = (count: number) => {
    onChange({
      [`${ticketId}${optionId ? `|${optionId}` : ''}`]: {
        quantity: count,
        price,
      },
    });
  };
  const { theme } = useTheme();

  return (
    <Flowbite
      theme={{
        theme: {
          dropdown: {
            floating: {
              target: 'w-full sm:w-fit',
            },
            inlineWrapper: `${theme.dropdown.inlineWrapper} border px-5 py-1 justify-between border-black w-full sm:w-24 flowbite-dropdown-target`,
            content: `${theme.dropdown.content} overflow-y-auto max-h-48 px-5 py-1`,
          },
        },
      }}
    >
      <Dropdown label={initialCount} inline={true} size="sm">
        {[...Array(limit + 1).keys()].map((i) => {
          return (
            <Dropdown.Item key={i} onClick={() => onSelect(i)}>
              {i}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </Flowbite>
  );
}
