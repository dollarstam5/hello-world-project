# Production Release Checklist

## Performance

- [ ] Main bundle < 150KB (current: ~300KB)
- [ ] Styles < 30KB (current: 37.8KB)
- [ ] TTI < 2s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Lighthouse score > 85

## Documentation

- [ ] All API endpoints documented in `docs/api/`
- [ ] Database schema in `docs/database/`
- [ ] Deployment steps in `docs/operations/deployment.md`
- [ ] AI guidelines in `docs/engineering/ai/`

## Code Quality

- [ ] All tests passing: `npm run test`
- [ ] Linter clean: `npm run lint`
- [ ] Type checking clean: `npm run type-check`
- [ ] No security warnings in dependencies

## Security

- [ ] Environment variables validated
- [ ] No secrets in git
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Auth flow tested end-to-end

## Deployment

- [ ] Build succeeds: `npm run build`
- [ ] Build output validated
- [ ] Staging environment tested
- [ ] Database migrations tested
- [ ] Rollback plan documented

## Monitoring

- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Log aggregation working
- [ ] Alerts configured
- [ ] Runbook created

## Go/No-Go Decision

**Status:** ⏳ PENDING

- [ ] All items above checked
- [ ] Stakeholder approval obtained
- [ ] Release notes written
- [ ] Communication plan ready

**Release Date:** TBD
