import type { Category } from '@/lib/types'
import { countLabel } from '@/lib/utils/count-bn'
import { Container, Content } from '@/components/ui/container'

export function CategoryHeader({
  category,
  count,
}: {
  category: Category
  count: number
}) {
  return (
    <Container>
      <Content>
        <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-white p-5">
          <span aria-hidden="true" className="text-4xl">
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{category.nameBn}</h1>
            <p className="mt-1 text-sm text-base-content/70">
              {countLabel(count, 'টি পণ্যের আজকের দাম ও পরিবর্তন')}
            </p>
          </div>
        </div>
      </Content>
    </Container>
  )
}
